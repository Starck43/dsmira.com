import { getYear } from "../core/utils"

export default function Copyright({ src }) {
    return (
        <div className="copyright bg-white">
            <small>
                {getYear()} &copy;&nbsp;Разработка сайта <a href={src}>iStarck</a>
            </small>
        </div>
    )
}
