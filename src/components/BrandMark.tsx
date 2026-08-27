export default function BrandMark({ size = 34 }: { size?: number }) {
  return <img src="/favicon.svg" alt="" width={size} height={size} style={{ display: 'block', flexShrink: 0 }} />
}
