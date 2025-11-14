import { useState, useCallback } from "react"

export function useTrainingRequestModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSuccess = useCallback(() => {
    // Can be extended with additional success handling logic
    console.log("Training request submitted successfully")
  }, [])

  return {
    isOpen,
    openModal,
    closeModal,
    handleSuccess,
  }
}

