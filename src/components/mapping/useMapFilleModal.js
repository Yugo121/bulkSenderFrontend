import { ref, computed } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'

export default function useMapFileModal() {
  const modalInstance = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = 10

  const selectedProductMappings = ref({})
  const selectedParameterMappings = ref({})

  const productProperties = ref([]) // przekazywane jako props z zewnątrz
  const parameters = ref([])
  const columnNames = ref([])
  const rawCsvData = ref([])

  const isFirstPage = computed(() => currentPage.value === 1)

  const totalPages = computed(() => 1 + Math.ceil(parameters.value.length / itemsPerPage))

  const currentFields = computed(() => {
    if (isFirstPage.value) return productProperties.value
    const start = (currentPage.value - 2) * itemsPerPage
    return parameters.value.slice(start, start + itemsPerPage).map(p => p.name)
  })

  const openModal = () => {
    modalInstance.value?.show()
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
  }

  const getFieldValue = (field) => {
    return isFirstPage.value ? selectedProductMappings.value[field] : selectedParameterMappings.value[field]
  }

  const updateMapping = (field, value) => {
    if (isFirstPage.value) {
      selectedProductMappings.value[field] = value
    } else {
      selectedParameterMappings.value[field] = value
    }
  }

  const mapFile = () => {
    const combinedMappings = {
      ...selectedProductMappings.value,
      ...selectedParameterMappings.value
    }

    const mappedProducts = rawCsvData.value.map(row => {
      const mappedRow = {}
      for (const [targetField, csvColumn] of Object.entries(combinedMappings)) {
        mappedRow[targetField] = row[csvColumn]
      }
      return mappedRow
    })

    const payload = {
      productMappings: selectedProductMappings.value,
      parameterMappings: selectedParameterMappings.value,
      products: mappedProducts
    }

    axios.post('https://localhost:7144/api/products/csv', payload)
      .then(res => console.log('Sent!', res))
      .catch(err => console.error('Error sending data:', err))
  }

  return {
    modalInstance, columnNames, productProperties, parameters, rawCsvData,
    selectedProductMappings, selectedParameterMappings,
    currentPage, totalPages, isFirstPage, currentFields,
    openModal, nextPage, prevPage, updateMapping, mapFile, getFieldValue
  }
}