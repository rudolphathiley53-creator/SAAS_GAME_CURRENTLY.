export function formatXof(amount: number | bigint) {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}
