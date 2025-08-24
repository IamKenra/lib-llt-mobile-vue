import { ref, Ref } from 'vue'

interface Camera {
  deviceId: string
  label: string
}

export const useQRScanner = () => {
  const videoRef: Ref<HTMLVideoElement | null> = ref(null)
  const isInitializing = ref(false)
  const isScanning = ref(false)
  const availableCameras = ref<MediaDeviceInfo[]>([])
  const selectedCameraId = ref<string>('')
  const scanResult = ref<string>('')
  
  let currentStream: MediaStream | null = null
  let scanInterval: number | null = null
  let jsQR: any = null

  const initializeScanner = async () => {
    try {
      isInitializing.value = true
      
      // Import jsQR dynamically
      if (!jsQR) {
        const jsQRModule = await import('jsqr')
        jsQR = jsQRModule.default
      }

      // Get available cameras
      await getCameras()
      
      // Start with back camera if available, otherwise first camera
      const backCamera = availableCameras.value.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('environment')
      )
      
      if (backCamera) {
        selectedCameraId.value = backCamera.deviceId
      } else if (availableCameras.value.length > 0) {
        selectedCameraId.value = availableCameras.value[0].deviceId
      }

      await startCamera()
    } catch (error) {
      console.error('Failed to initialize scanner:', error)
    } finally {
      isInitializing.value = false
    }
  }

  const getCameras = async () => {
    try {
      // Request permission first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      
      // Get devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      availableCameras.value = devices.filter(device => device.kind === 'videoinput')
    } catch (error) {
      console.error('Failed to get cameras:', error)
    }
  }

  const startCamera = async () => {
    try {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop())
      }

      const constraints = {
        video: {
          deviceId: selectedCameraId.value ? { exact: selectedCameraId.value } : undefined,
          facingMode: selectedCameraId.value ? undefined : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }

      currentStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.value) {
        videoRef.value.srcObject = currentStream
        await videoRef.value.play()
      }
    } catch (error) {
      console.error('Failed to start camera:', error)
    }
  }

  const startScanning = () => {
    if (isScanning.value || !videoRef.value || !jsQR) return

    isScanning.value = true
    
    const scan = () => {
      if (!videoRef.value || !isScanning.value) return

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      if (context && videoRef.value.videoWidth && videoRef.value.videoHeight) {
        canvas.width = videoRef.value.videoWidth
        canvas.height = videoRef.value.videoHeight
        
        context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        })
        
        if (code) {
          scanResult.value = code.data
          stopScanning()
        }
      }
    }

    scanInterval = window.setInterval(scan, 100)
  }

  const stopScanning = () => {
    isScanning.value = false
    if (scanInterval) {
      clearInterval(scanInterval)
      scanInterval = null
    }
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop())
      currentStream = null
    }
  }

  const selectCamera = async (camera: MediaDeviceInfo) => {
    selectedCameraId.value = camera.deviceId
    await startCamera()
    if (isScanning.value) {
      stopScanning()
      startScanning()
    }
  }

  const closeScanResult = () => {
    scanResult.value = ''
    startScanning()
  }

  return {
    videoRef,
    isInitializing,
    isScanning,
    availableCameras,
    selectedCameraId,
    scanResult,
    initializeScanner,
    startScanning,
    stopScanning,
    selectCamera,
    closeScanResult
  }
}