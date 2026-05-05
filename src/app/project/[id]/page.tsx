import CodePreviewSection from "@/components/preview";

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <CodePreviewSection code="fx" projectId={parseInt(id)} />
    </>
  );
}
