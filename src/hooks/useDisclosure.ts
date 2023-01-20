import { useState } from "react";

export default function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    onClose: () => setIsOpen(false),
    onOpen: () => setIsOpen(true),
  }
}