<template>
  <div class="mobile-details">
    <!-- Header -->
    <div class="details-header">
      <button @click="goBack" class="back-btn">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="header-title">Data Lansia</h1>
      <button @click="startScanning" class="scan-again-btn">
        <i class="pi pi-qrcode"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>Memuat data lansia...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h3>Data Tidak Ditemukan</h3>
      <p>{{ error }}</p>
      <button @click="startScanning" class="retry-btn">
        <i class="pi pi-refresh"></i>
        <span>Scan Ulang</span>
      </button>
    </div>

    <!-- Details Content -->
    <div v-else-if="elderlyData" class="details-content">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">{{ elderlyData.name }}</h2>
          <p class="profile-id">ID: {{ elderlyData.id }}</p>
        </div>
        <div class="profile-status">
          <span class="status-badge" :class="elderlyData.healthStatus">
            {{ getStatusText(elderlyData.healthStatus) }}
          </span>
        </div>
      </div>

      <!-- Basic Information -->
      <div class="info-section">
        <h3 class="section-title">
          <i class="pi pi-info-circle"></i>
          Informasi Dasar
        </h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Usia</span>
            <span class="info-value">{{ elderlyData.age }} tahun</span>
          </div>
          <div class="info-item">
            <span class="info-label">Jenis Kelamin</span>
            <span class="info-value">{{ elderlyData.gender }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Alamat</span>
            <span class="info-value">{{ elderlyData.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">RT/RW</span>
            <span class="info-value">{{ elderlyData.rt }}/{{ elderlyData.rw }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">No. Telp</span>
            <span class="info-value">{{ elderlyData.phone || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Health Records -->
      <div class="info-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="pi pi-heart"></i>
            Riwayat Kesehatan
          </h3>
          <button @click="showAddRecord = true" class="add-record-btn">
            <i class="pi pi-plus"></i>
            <span>Tambah</span>
          </button>
        </div>
        
        <div v-if="elderlyData.healthRecords && elderlyData.healthRecords.length > 0" class="health-records">
          <div 
            v-for="record in elderlyData.healthRecords" 
            :key="record.id"
            class="health-record"
          >
            <div class="record-header">
              <span class="record-date">{{ formatDate(record.date) }}</span>
              <span class="record-by">{{ record.surveyorName }}</span>
            </div>
            <div class="record-content">
              <div class="vital-signs">
                <div class="vital-item" v-if="record.bloodPressure">
                  <span class="vital-label">Tekanan Darah:</span>
                  <span class="vital-value">{{ record.bloodPressure }}</span>
                </div>
                <div class="vital-item" v-if="record.weight">
                  <span class="vital-label">Berat Badan:</span>
                  <span class="vital-value">{{ record.weight }} kg</span>
                </div>
                <div class="vital-item" v-if="record.height">
                  <span class="vital-label">Tinggi Badan:</span>
                  <span class="vital-value">{{ record.height }} cm</span>
                </div>
              </div>
              <div v-if="record.notes" class="record-notes">
                <p>{{ record.notes }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-records">
          <i class="pi pi-file-excel"></i>
          <p>Belum ada riwayat kesehatan</p>
        </div>
      </div>
    </div>

    <!-- Add Health Record Modal -->
    <div v-if="showAddRecord" class="modal-overlay" @click="showAddRecord = false">
      <div class="add-record-modal" @click.stop>
        <div class="modal-header">
          <h3>Tambah Riwayat Kesehatan</h3>
          <button @click="showAddRecord = false" class="modal-close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveHealthRecord" class="record-form">
            <div class="form-group">
              <label>Tekanan Darah</label>
              <input 
                type="text" 
                v-model="newRecord.bloodPressure"
                placeholder="120/80"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Berat Badan (kg)</label>
              <input 
                type="number" 
                v-model="newRecord.weight"
                placeholder="65"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Tinggi Badan (cm)</label>
              <input 
                type="number" 
                v-model="newRecord.height"
                placeholder="160"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Catatan</label>
              <textarea 
                v-model="newRecord.notes"
                placeholder="Tambahkan catatan kesehatan..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" @click="showAddRecord = false" class="cancel-btn">
                Batal
              </button>
              <button type="submit" class="save-btn" :disabled="isSaving">
                <i v-if="isSaving" class="pi pi-spin pi-spinner"></i>
                <span>{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface HealthRecord {
  id: string
  date: Date
  surveyorName: string
  bloodPressure?: string
  weight?: number | null
  height?: number | null
  notes?: string
}

interface ElderlyData {
  id: string
  name: string
  age: number
  gender: string
  address: string
  rt: string
  rw: string
  phone?: string
  healthStatus: 'healthy' | 'caution' | 'critical'
  healthRecords?: HealthRecord[]
}

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const error = ref('')
const elderlyData = ref<ElderlyData | null>(null)
const showAddRecord = ref(false)
const isSaving = ref(false)

const newRecord = ref({
  bloodPressure: '',
  weight: null as number | null,
  height: null as number | null,
  notes: ''
})

const goBack = () => {
  router.push('/scanner')
}

const startScanning = () => {
  router.push('/scanner')
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'healthy': return 'Sehat'
    case 'caution': return 'Perhatian'
    case 'critical': return 'Kritis'
    default: return 'Tidak Diketahui'
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const loadElderlyData = async (scannedData: string) => {
  try {
    isLoading.value = true
    error.value = ''

    // Simulate API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data based on scanned QR code
    const mockData: ElderlyData = {
      id: scannedData,
      name: 'Siti Aminah',
      age: 68,
      gender: 'Perempuan',
      address: 'Jl. Mawar No. 15, Kotabaru',
      rt: '05',
      rw: '02',
      phone: '081234567890',
      healthStatus: 'healthy',
      healthRecords: [
        {
          id: '1',
          date: new Date('2024-01-15'),
          surveyorName: 'Dr. Budi Santoso',
          bloodPressure: '120/80',
          weight: 65,
          height: 155,
          notes: 'Kondisi kesehatan baik, rutin minum obat hipertensi'
        },
        {
          id: '2',
          date: new Date('2024-02-20'),
          surveyorName: 'Ns. Sari Dewi',
          bloodPressure: '125/85',
          weight: 64,
          notes: 'Tekanan darah sedikit naik, disarankan kontrol diet garam'
        }
      ]
    }

    elderlyData.value = mockData
  } catch (err) {
    error.value = 'Gagal memuat data lansia. Pastikan QR code valid.'
    console.error('Failed to load elderly data:', err)
  } finally {
    isLoading.value = false
  }
}

const saveHealthRecord = async () => {
  try {
    isSaving.value = true

    // Validate required fields
    if (!newRecord.value.bloodPressure && !newRecord.value.weight && !newRecord.value.height) {
      alert('Mohon isi minimal satu data kesehatan')
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add new record to existing data
    const record: HealthRecord = {
      id: Date.now().toString(),
      date: new Date(),
      surveyorName: 'Surveyor Mobile', // Get from login session
      ...newRecord.value
    }

    if (elderlyData.value) {
      if (!elderlyData.value.healthRecords) {
        elderlyData.value.healthRecords = []
      }
      elderlyData.value.healthRecords.unshift(record)
    }

    // Reset form
    newRecord.value = {
      bloodPressure: '',
      weight: null,
      height: null,
      notes: ''
    }

    showAddRecord.value = false
  } catch (err) {
    alert('Gagal menyimpan data kesehatan')
    console.error('Failed to save health record:', err)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  const scannedData = route.query.data as string
  if (scannedData) {
    loadElderlyData(scannedData)
  } else {
    error.value = 'Data QR code tidak ditemukan'
  }
})
</script>

<style scoped>
.mobile-details {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.details-header {
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn,
.scan-again-btn {
  background: #f3f4f6;
  border: none;
  color: #374151;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover,
.scan-again-btn:hover {
  background: #e5e7eb;
}

.scan-again-btn {
  background: #4A90E2;
  color: white;
}

.scan-again-btn:hover {
  background: #2E5BBA;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.loading-container,
.error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.loading-icon,
.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-icon {
  color: #4A90E2;
}

.error-icon {
  color: #ef4444;
}

.error-container h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.error-container p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.retry-btn {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background: #2E5BBA;
}

.details-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-section {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  background: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.profile-id {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.healthy {
  background: #dcfce7;
  color: #166534;
}

.status-badge.caution {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.critical {
  background: #fee2e2;
  color: #dc2626;
}

.info-section {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #4A90E2;
}

.add-record-btn {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-record-btn:hover {
  background: #2E5BBA;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.health-records {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.health-record {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.record-date {
  font-weight: 500;
  color: #1f2937;
}

.record-by {
  font-size: 0.875rem;
  color: #6b7280;
}

.vital-signs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.vital-item {
  display: flex;
  justify-content: space-between;
}

.vital-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.vital-value {
  font-weight: 500;
  color: #1f2937;
}

.record-notes {
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.record-notes p {
  color: #4b5563;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.no-records {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.no-records i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.add-record-modal {
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  background: #f9fafb;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4A90E2;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: #4A90E2;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #2E5BBA;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>