'use server';

import axios, { AxiosResponse } from 'axios';

type RequestBody = {
    image: string;
};

type ResponseBody = AxiosResponse<{
    data: {
        id: string;
    };
}>;

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID as string;

/**
 * Upload an image to Imgur
 * @param image - The base64 encoded image to upload
 * @returns The URL of the uploaded image
 */
export async function uploadImage(image: string) {
    // remove the datatype prefix - data:image/png;base64
    const data = image.substring(image.indexOf(',') + 1);

    const response = await axios.post<RequestBody, ResponseBody>(
        'https://api.imgur.com/3/image',
        {
            image: data,
        },
        {
            headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
            },
        },
    );

    return {
        url: `https://i.imgur.com/${response.data.data.id}.webp`,
    };
}
