import { getYear } from "../core/utils"

export default function Copyright({ src }) {
    return (
        <div className="copyright bg-white">
            <small>
                2021 - {getYear()} &copy;&nbsp; Права защищены. Реализация <a href={src}>iStarck</a>
            </small>
        </div>
    )
}
