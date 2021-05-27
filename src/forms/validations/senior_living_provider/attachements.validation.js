export function checkIfFilesAreTooBig(file ){
    
    const isVideo = file?.[0]?.type?.includes('video') ? true : false;
    const isImage = file?.[0]?.type?.includes('image') ? true : false;

    let fileSize = 0;
    if(isImage){
        file && file.forEach((f) => {
            fileSize += f?.size;
        })
    }
    if(isVideo){
        fileSize = file?.[0]?.size
    }

    let valid = true
    if ((fileSize / 1024 / 1024) > 50) {
        valid = false
    }
    return valid
}
  
export function checkIfImageFilesAreCorrectType(file){
    let valid = true
    if (file) {
      
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/tif', 'image/gif'].includes(file?.[0]?.type)) {
          valid = false
        }
    }
    return valid
}

export function checkIfVideoFilesAreCorrectType(file){
    let valid = true
    if (file) {
        if (!['video/mp4','video/x-m4v', 'video/avi', 'video/mpg', 'video/mkv',
            'video/webm', 'video/mp2', 'video/mpeg', 'video/mpe', 'video/mpv',
            'video/ogg', 'video/m4p', 'video/m4v', 'video/wmv', 'video/quicktime', 'video/x-quicktime', 'video/qt',
            'video/flv', 'video/swf', 'video/avchd'].includes(file?.[0]?.type)) {
            valid = false
        }
    }
  return valid
}