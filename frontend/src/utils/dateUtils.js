export const calculateDueDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-10`; // Asegura que el mes tenga dos dígitos
};