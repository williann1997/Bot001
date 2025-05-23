export interface ValidationResult {
  success: boolean;
  error?: string;
}

export function validateFarmData(name: string, userId: string, boxesStr: string): ValidationResult {
  // Validate name
  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres.'
    };
  }

  if (name.trim().length > 100) {
    return {
      success: false,
      error: 'Nome não pode exceder 100 caracteres.'
    };
  }

  // Validate user ID
  if (!userId || userId.trim().length < 1) {
    return {
      success: false,
      error: 'ID do usuário é obrigatório.'
    };
  }

  if (userId.trim().length > 50) {
    return {
      success: false,
      error: 'ID do usuário não pode exceder 50 caracteres.'
    };
  }

  // Validate boxes quantity
  if (!boxesStr || boxesStr.trim().length === 0) {
    return {
      success: false,
      error: 'Quantidade de caixas é obrigatória.'
    };
  }

  const boxQuantity = parseInt(boxesStr.trim());
  
  if (isNaN(boxQuantity)) {
    return {
      success: false,
      error: 'Quantidade de caixas deve ser um número válido.'
    };
  }

  if (boxQuantity < 1) {
    return {
      success: false,
      error: 'Quantidade de caixas deve ser maior que zero.'
    };
  }

  if (boxQuantity > 999999) {
    return {
      success: false,
      error: 'Quantidade de caixas muito alta. Máximo: 999.999.'
    };
  }

  return { success: true };
}

export function validateSalesData(
  name: string, 
  userId: string, 
  description: string, 
  deliveryStatus: string, 
  totalValue: string
): ValidationResult {
  // Validate name
  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres.'
    };
  }

  if (name.trim().length > 100) {
    return {
      success: false,
      error: 'Nome não pode exceder 100 caracteres.'
    };
  }

  // Validate user ID
  if (!userId || userId.trim().length < 1) {
    return {
      success: false,
      error: 'ID do usuário é obrigatório.'
    };
  }

  if (userId.trim().length > 50) {
    return {
      success: false,
      error: 'ID do usuário não pode exceder 50 caracteres.'
    };
  }

  // Validate description
  if (!description || description.trim().length < 5) {
    return {
      success: false,
      error: 'Descrição deve ter pelo menos 5 caracteres.'
    };
  }

  if (description.trim().length > 500) {
    return {
      success: false,
      error: 'Descrição não pode exceder 500 caracteres.'
    };
  }

  // Validate delivery status
  if (!deliveryStatus || deliveryStatus.trim().length < 1) {
    return {
      success: false,
      error: 'Status de entrega é obrigatório.'
    };
  }

  if (deliveryStatus.trim().length > 50) {
    return {
      success: false,
      error: 'Status de entrega não pode exceder 50 caracteres.'
    };
  }

  // Validate total value
  if (!totalValue || totalValue.trim().length < 1) {
    return {
      success: false,
      error: 'Valor total é obrigatório.'
    };
  }

  if (totalValue.trim().length > 20) {
    return {
      success: false,
      error: 'Valor total não pode exceder 20 caracteres.'
    };
  }

  return { success: true };
}

export function validateWelcomeData(name: string, userId: string, role: string): ValidationResult {
  // Validate name
  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres.'
    };
  }

  if (name.trim().length > 100) {
    return {
      success: false,
      error: 'Nome não pode exceder 100 caracteres.'
    };
  }

  // Validate user ID
  if (!userId || userId.trim().length < 1) {
    return {
      success: false,
      error: 'ID do usuário é obrigatório.'
    };
  }

  if (userId.trim().length > 50) {
    return {
      success: false,
      error: 'ID do usuário não pode exceder 50 caracteres.'
    };
  }

  // Validate role
  if (!role || role.trim().length < 2) {
    return {
      success: false,
      error: 'Cargo deve ter pelo menos 2 caracteres.'
    };
  }

  if (role.trim().length > 100) {
    return {
      success: false,
      error: 'Cargo não pode exceder 100 caracteres.'
    };
  }

  return { success: true };
}
