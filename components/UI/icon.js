import Image from "next/image"

export default function Icon({ src, height, width }) {
    return (
        <Image
            src={src}
            //loader={remoteLoader}
            //placeholder={blur}
            alt=""
            className="icon"
            width={width}
            height={height}
            style={{
                objectFit: "contain"
            }} />
    );
}
