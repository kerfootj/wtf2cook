'use client';

import { uploadImage } from '@/app/actions/uploadImage';
import { CloudUpload } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import compressImage from 'browser-image-compression';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { DropZoneContainer, DropZoneContent } from './ImageUpload.styles';

const IMAGE_TYPES = ['.png', '.jpg', '.webp'];

export type ImageUploadProps = {
    multiple?: boolean;
    onDrop: (image: { url: string }) => void;
};

export function ImageUpload(props: ImageUploadProps) {
    const { multiple, onDrop } = props;

    const [loading, setLoading] = useState(false);

    const handleDrop = async (files: File[]) => {
        setLoading(true);

        const blob = await compressImage(files[0], { maxSizeMB: 2 });

        const base64 = await blobToBase64(blob);

        const image = await uploadImage(base64);

        onDrop(image);

        setLoading(false);
    };

    return (
        <Dropzone
            multiple={multiple}
            onDrop={handleDrop}
            accept={{ 'image/*': IMAGE_TYPES }}
            disabled={loading}
        >
            {({ getRootProps, getInputProps }): JSX.Element => (
                <section style={{ width: '100%', height: '100%' }}>
                    <DropZoneContainer {...getRootProps()}>
                        <input {...getInputProps()} />
                        <DropZoneContent>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <CloudUpload />

                                    <Typography
                                        variant="body1"
                                        textAlign="center"
                                    >
                                        Upload a file or drag and drop
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        textAlign="center"
                                    >
                                        {IMAGE_TYPES.join(', ').replace(
                                            /\./g,
                                            '',
                                        )}
                                    </Typography>
                                </>
                            )}
                        </DropZoneContent>
                    </DropZoneContainer>
                </section>
            )}
        </Dropzone>
    );
}

/**
 * Converts an image blob to a base64 string
 * @param blob - The blob to convert to base64
 * @returns A promise that resolves to the base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}
