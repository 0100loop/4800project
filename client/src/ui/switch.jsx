export function Switch({checked,onCheckedChange}) {
  return (
    <button onClick={()=>onCheckedChange(!checked)}
      className={"w-12 h-7 rounded-full p-1 transition "+(checked?"bg-[#06B6D4]":"bg-gray-300")}>
      <div className={"w-5 h-5 bg-white rounded-full transition "+(checked?"translate-x-5":"")}/>
    </button>
  );
}
