import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tel = searchParams.get('tel');
  const apiKey = process.env.NEXT_PUBLIC_HOT_PEPPER_API_KEY;

  if (!tel) {
    return NextResponse.json({ error: 'Telephone number is required' }, { status: 400 });
  }

  const baseUrl = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/';
  const url = new URL(baseUrl);

  url.searchParams.append('key', apiKey);
  url.searchParams.append('tel', tel);
  url.searchParams.append('format', 'json');

  try {
    console.log('Fetching data from Hot Pepper API:', url.toString()); // デバッグ用ログ
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error response from Hot Pepper API: ${errorData}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data.results.shop);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
