import React from "react";
import _ from 'lodash';
const noop = () => {};

const FileUpload = ({ value, onChange = noop, label, src, multiple, ...rest }) => {
    return (
        <div className="custom-file-upload">
            <label>
                {
                    src ? 
                    <img src={src} alt="Upload Icon" className="upload-icon" /> : null
                }
                {label ? <span>{label}</span> : null}
                <input
                    {...rest}
                    style={{ display: "none" }}
                    type="file"
                    multiple={multiple}
                    onChange={e => {
                        onChange([...e.target.files]);
                    }}
                />
            </label>
            {Boolean(value?.length) && (
                <div className="selected-files">
                    <span>Selected files:</span>
                    <span className="file-name">
                        {
                            rest.name !== 'image_file' 
                            ? value.map(f => f)?.join(", ")
                            : _.flattenDeep(value)?.map((file, index) => file?.name)?.join(", ")
                        }
                    </span>
                </div>
            )}
        </div>
    )
};

export default FileUpload;