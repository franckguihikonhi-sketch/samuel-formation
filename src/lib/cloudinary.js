const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploaderVideo(fichier, onProgres) {
  const formData = new FormData()
  formData.append('file', fichier)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('resource_type', 'video')

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgres) {
        onProgres(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error('Échec de l\'upload'))
      }
    }

    xhr.onerror = () => reject(new Error('Erreur réseau'))

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`)
    xhr.send(formData)
  })
}

export function getVideoUrl(publicId, options = {}) {
  const { quality = 'auto', format = 'mp4' } = options
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_${quality},f_${format}/${publicId}`
}

export function getThumbnailUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,w_640,h_360,c_fill,f_jpg/${publicId}`
}
