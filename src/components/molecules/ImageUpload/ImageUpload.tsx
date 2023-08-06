import { CloudUpload } from '@mui/icons-material';
import { Typography } from '@mui/material';
import Dropzone from 'react-dropzone';
import { DropZoneContainer, DropZoneContent } from './ImageUpload.styles';

const IMAGE_TYPES = ['.svg', '.webp', '.png', '.jpg'];

export type ImageUploadProps = {
    multiple?: boolean;
    onDrop: (files: File[]) => void;
};

export function ImageUpload(props: ImageUploadProps) {
    const { multiple, onDrop } = props;

    return (
        <Dropzone
            multiple={multiple}
            onDrop={onDrop}
            accept={{ 'image/*': IMAGE_TYPES }}
        >
            {({ getRootProps, getInputProps }): JSX.Element => (
                <section style={{ width: '100%', height: '100%' }}>
                    <DropZoneContainer {...getRootProps()}>
                        <input {...getInputProps()} />
                        <DropZoneContent>
                            <CloudUpload />

                            <Typography variant="body1" textAlign="center">
                                Upload a file or drag and drop
                            </Typography>
                            <Typography variant="caption" textAlign="center">
                                {IMAGE_TYPES.join(', ').replace(/\./g, '')}
                            </Typography>
                        </DropZoneContent>
                    </DropZoneContainer>
                </section>
            )}
        </Dropzone>
    );
}
