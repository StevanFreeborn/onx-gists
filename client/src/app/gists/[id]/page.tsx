export default function Gist({ params }: { params: { id: string } }) {
  return <h1>{params.id}</h1>;
}
