import { useParams, useLocation, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Post = () => {
    const location = useLocation()
    const post = location.state.post

    const notify = (url) => {
        if (!url) return toast.error("Kaynak Bulunamadı")
        window.open(url, '_blank')
    }

    return (
        <div className="flex flex-col shadow-xl w-[80%] mx-auto space-y-4 p-4">
            <h2 className="text-xl">{post.title}</h2>
            <p className="">{post.selftext}</p>
            
            <div className="flex flex-row justify-center gap-4 text-center py-4">
                <Link
                    to={`/`}
                    state={{ posts: location.state.posts }}
                    className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                >
                    Geri
                </Link>
                <Link
                    to={`https://www.reddit.com${post.permalink}`}
                    state={{ posts: location.state.posts }}
                    className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                >
                    Post Link
                </Link>
                <button
                    onClick={() => notify(post.source)}
                    
                    className = "bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                    
                >
                    {post.source ? 'Kaynağı görüntüle' : 'Kaynak yok'}
                </button>
                {<ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />}
            </div>
        </div>
    )
}

export default Post
