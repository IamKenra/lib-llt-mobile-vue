<template>
  <div class="min-h-screen bg-black flex flex-col relative">
    <!-- Header -->
    <div class="bg-black/80 p-4 flex items-center justify-between relative z-10">
      <button @click="goBack" class="bg-white/20 border-none text-white p-3 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-white/30">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="text-white text-xl font-semibold m-0">QR Scanner</h1>
      <button @click="showCameraOptions = true" class="bg-white/20 border-none text-white p-3 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-white/30">
        <i class="pi pi-camera"></i>
      </button>
    </div>

    <!-- QR Scanner Container -->
    <div class="flex-1 flex flex-col">
      <div class="flex-1 relative min-h-[60vh]">
        <video
          ref="videoRef"
          class="w-full h-full object-cover"
          autoplay
          muted
          playsinline
        ></video>
        
        <!-- Scan overlay -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-64 h-64 relative">
            <div class="absolute top-0 left-0 w-8 h-8 border-3 border-blue-500 border-r-0 border-b-0"></div>
            <div class="absolute top-0 right-0 w-8 h-8 border-3 border-blue-500 border-l-0 border-b-0"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8 border-3 border-blue-500 border-r-0 border-t-0"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8 border-3 border-blue-500 border-l-0 border-t-0"></div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isInitializing" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
          <i class="pi pi-spin pi-spinner text-3xl mb-4"></i>
          <p>Initializing camera...</p>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-black/80 p-6 text-center text-white">
        <i class="pi pi-qrcode text-3xl text-blue-500 mb-2"></i>
        <p class="my-1">Point your camera at a QR code to scan</p>
        <p class="my-1 text-gray-300 text-sm">Make sure the QR code is clearly visible</p>
      </div>
    </div>

    <!-- Camera Options Modal -->
    <div v-if="showCameraOptions" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4" @click="showCameraOptions = false">
      <div class="bg-white rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden" @click.stop>
        <div class="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="m-0 text-lg font-semibold">Select Camera</h3>
          <button @click="showCameraOptions = false" class="bg-transparent border-none text-gray-600 p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="p-4 flex flex-col gap-2">
          <button
            v-for="camera in availableCameras"
            :key="camera.deviceId"
            @click="selectCamera(camera)"
            class="bg-transparent border border-gray-200 p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 text-left hover:border-blue-500 hover:bg-blue-50"
            :class="{ 'border-blue-500 bg-blue-50': selectedCameraId === camera.deviceId }"
          >
            <i class="pi pi-camera text-blue-500"></i>
            <span class="flex-1">{{ camera.label || `Camera ${camera.deviceId.slice(0, 8)}` }}</span>
            <i v-if="selectedCameraId === camera.deviceId" class="pi pi-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Scan Result Modal -->
    <div v-if="scanResult" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4" @click="closeScanResult">
      <div class="bg-white rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden" @click.stop>
        <div class="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="m-0 text-lg font-semibold">QR Code Scanned</h3>
          <button @click="closeScanResult" class="bg-transparent border-none text-gray-600 p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="text-center mb-6">
            <i class="pi pi-qrcode text-3xl text-blue-500 mb-2"></i>
            <p class="break-all bg-gray-100 p-4 rounded-xl border border-gray-200 font-mono">{{ scanResult }}</p>
          </div>
          <div class="flex gap-4">
            <button @click="copyScanResult" class="flex-1 px-4 py-3 rounded-xl border-none font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
              <i class="pi pi-copy"></i>
              <span>Copy</span>
            </button>
            <button @click="viewDetails" class="flex-1 px-4 py-3 rounded-xl border-none font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-700">
              <i class="pi pi-eye"></i>
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQRScanner } from '../../composables/useQRScanner'

const router = useRouter()

const {
  videoRef,
  isInitializing,
  availableCameras,
  selectedCameraId,
  scanResult,
  initializeScanner,
  startScanning,
  stopScanning,
  selectCamera: switchCamera,
  closeScanResult
} = useQRScanner()

const showCameraOptions = ref(false)

const goBack = () => {
  stopScanning()
  router.push('/login')
}

const selectCamera = (camera: MediaDeviceInfo) => {
  switchCamera(camera)
  showCameraOptions.value = false
}

const copyScanResult = async () => {
  if (scanResult.value) {
    try {
      await navigator.clipboard.writeText(scanResult.value)
      // You could add a toast notification here
      console.log('Copied to clipboard:', scanResult.value)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
}

const viewDetails = () => {
  if (scanResult.value) {
    // Navigate to details page with scanned data
    router.push({
      path: '/details',
      query: { data: scanResult.value }
    })
  }
}

onMounted(async () => {
  await initializeScanner()
  startScanning()
})

onUnmounted(() => {
  stopScanning()
})
</script>

<style scoped>
/* Custom styles that Tailwind CSS can't handle or specific mobile optimizations */
</style>