/**
 * 画像を生成して返す
 */
import { ImageResponse } from 'next/og';
import { NextResponse } from 'next/server';
import { getPost } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name?: string }> }
) {
  const fileName = (await params).name;
  const number = fileName?.match(/^image(\d+)\.png$/)?.[1];

  if( !number ){
    return new NextResponse('Not Found', { status: 404 });
  }
 
  const title = (await getPost( `p${number}` ))?.title;
  if( !title ){
    return new NextResponse('Not Found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 30,
          background: 'antiquewhite',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div>{title}</div>
        <div>{fileName}</div>
      </div>
    ),
    {
      width: 600,
      height: 400,
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    }
  )
}