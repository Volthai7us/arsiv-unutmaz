import { useParams } from 'react-router-dom'

const Post = () => {
    const id = useParams().id
    return (
        <div>
            <h1>PAGE: {id}</h1>
        </div>
    )
}

export default Post
