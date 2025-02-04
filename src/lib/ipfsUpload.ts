import axios, { AxiosProgressEvent } from 'axios';

export const uploadToIPFS = (data: File, progress: (event: AxiosProgressEvent) => void) =>
  new Promise<string>(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('file', data);
    formData.append('pinataMetadata', JSON.stringify({ name: 'SQD' }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`, // Updated to use getBoundary()
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_KEY}`,
        },
        onUploadProgress: progress,
      });

      resolve(`https://ipfs.io/ipfs/${res.data.IpfsHash}`);
    } catch (error) {
      console.error('IPFS upload error:', error);
      reject('IPFS projectInfo upload failed');
    }
  });
