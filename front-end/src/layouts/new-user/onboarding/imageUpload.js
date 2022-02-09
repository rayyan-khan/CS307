import React, { useState } from 'react'
import ImageUpload from 'image-upload-react'
//important for getting nice style.
import 'image-upload-react/dist/index.css'

function ImageUploadHelper() {
    const [imageSrc, setImageSrc] = useState()

    const handleImageSelect = (e) => {
        setImageSrc(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <ImageUpload
            handleImageSelect={handleImageSelect}
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            style={{
                width: 525,
                height: 375,
                background: '#151516'
            }}
        />
    )
}

export default ImageUploadHelper