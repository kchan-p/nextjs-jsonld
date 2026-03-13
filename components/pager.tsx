/**
 * ページ選択UI
 */
import Link from "next/link";

interface Props {
  pageNum: number;  // ページ数
  currentPage:number; // 現在のページ（1から開始）
  basePath:string; // 基準となるパス
}

function Pager({pageNum,currentPage,basePath}:Props){

    const cPage = currentPage - 1;
    const bPath = basePath ? `${basePath}` : "/" ;

    const items = Array.from({length:pageNum},(v,index)=>{
        const href = index === 0 ? bPath : `${bPath}page/${index+1}`;

        return index === cPage ? 
            (<span key={index} className="currentpage">{index+1}</span>) :
            (
            <Link  key={index} href={ href }>
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