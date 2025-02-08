import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '../models/model';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('request', data);

    const newData = await Admin.findOneAndUpdate(
      {},
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );

    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await Admin.findOne();
    if (data?.publicKey) {
      return NextResponse.json({ pubKey: data.publicKey }, { status: 200 });
    } else {
      return NextResponse.json({ pubKey: 'PubKey not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid Server Error' }, { status: 500 });
  }
}
