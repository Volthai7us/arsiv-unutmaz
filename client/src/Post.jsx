import { useParams, useLocation, Link } from 'react-router-dom'

const Post = () => {
    const location = useLocation()
    const post = location.state.post

    const onSourceClick = (url) => {
        if (!url) return alert('Kaynak bulunamadı.')
        window.open(url, '_blank')
    }

    return (
        <div className="flex flex-col shadow-xl border-[1px] border-first bg-[#041C32] shadow-xl w-[80%] mx-auto space-y-4 p-4 my-20">
            <h2 className="text-xl text-center text-second">{post.title}</h2>
            <hr className="w-[80%] mx-auto" />
            <p className="line-clamp-2 text-center text-second">
                {post.selftext}
            </p>
            <div className="flex flex-row justify-center gap-4 text-center py-4">
                <Link
                    to={`/`}
                    state={{ posts: location.state.posts }}
                    className="bg-button hover:bg-buttonHover hover:text-button w-fit text-white font-bold py-2 px-4 rounded"
                >
                    Geri
                </Link>
                <Link
                    to={`https://www.reddit.com${post.permalink}`}
                    state={{ posts: location.state.posts }}
                    className="bg-button hover:bg-buttonHover hover:text-button w-fit text-white font-bold py-2 px-4 rounded"
                >
                    Post Link
                </Link>
                <button
                    onClick={() => onSourceClick(post.source)}
                    className="bg-button hover:bg-buttonHover hover:text-button w-fit text-white font-bold py-2 px-4 rounded"
                >
                    {post.source ? 'Kaynağı görüntüle' : 'Kaynak yok'}
                </button>
            </div>
        </div>
    )
}

export default Post
