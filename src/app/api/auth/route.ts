import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '../models/model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const adminData = await Admin.findOne({});

    const data = await req.json();
    const auth = adminData?.password === data.password;

    console.log('request', adminData?.password, data);
    return NextResponse.json({
      success: auth,
      pubKey: adminData?.publicKey,
      fee: adminData?.fee,
      mintableFee: adminData?.mintableFee,
      freezeableFee: adminData?.freezeableFee,
      updateableFee: adminData?.updateableFee,
      creatorFee: adminData?.creatorFee,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
