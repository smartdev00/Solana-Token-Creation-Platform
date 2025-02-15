/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '../models/model';
import connectDB from '@/lib/mongodb';

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

    if (!newData) {
      return NextResponse.json({ message: 'Configuration data not found' }, { status: 403 });
    }

    return NextResponse.json(
      {
        pubKey: newData.publicKey,
        fee: newData.fee,
        creatorFee: newData.creatorFee,
        updateableFee: newData.updateableFee,
        freezeableFee: newData.freezeableFee,
        mintableFee: newData.mintableFee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Remove the body parsing for GET requests
    connectDB();
    const data = await Admin.findOne();
    console.log(data);
    if (data?.publicKey) {
      return NextResponse.json(
        {
          pubKey: data.publicKey,
          fee: data.fee,
          creatorFee: data.creatorFee,
          updateableFee: data.updateableFee,
          freezeableFee: data.freezeableFee,
          mintableFee: data.mintableFee,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: 'Data not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Invalid Server Error' }, { status: 500 });
  }
}
