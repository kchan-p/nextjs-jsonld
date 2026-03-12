/**
 * ページ選択UI
 */
import Link from "next/link";

interface Props {
  itemNum: number;  // 全アイテム数
  perPage: number;  // 1ページのアイテム数
  currentPage:number; // 現在のページ（1から開始）
}

function Pager({itemNum,perPage,currentPage}:Props){
    const pageNum = Math.floor(itemNum / perPage) + 1;
    const cPage = currentPage - 1;

    const items = Array.from({length:pageNum},(v,index)=>{
        return index === cPage ? 
            (<span key={index} className="currentpage">{index+1}</span>) :
            (
            <Link  key={index} href={ `./?page=${index+1}`}>
                <span className="pageritem">{index+1}</span>
            </Link>
            );
    });

    return (
        <div className="pager">
            {items}
        </div>
    );
}

export {Pager};