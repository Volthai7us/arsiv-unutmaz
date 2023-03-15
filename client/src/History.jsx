import { useState, useEffect } from 'react'
import { getPosts, getPostsBySearch, getPost } from './api'
import Next from '/next.svg'
import Back from '/back.svg'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function History() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [searchResultText, setSearchResultText] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchPosts = async () => {
        setLoading(true)
        const posts = await getPosts(page)
        setSearchResultText('')
        setPosts(posts)
        setLoading(false)
    }

    const fetchSearch = async () => {
        setLoading(true)
        const posts = await getPostsBySearch(search)
        setSearchResultText(`"${posts.length}" sonuc bulundu`)
        setPosts(posts)
        setLoading(false)
    }

    useEffect(() => {
        if (location.state?.posts) setPosts(location.state.posts)
        else {
            fetchPosts()
            setSearch('')
        }
    }, [page])

    const notify = (url) => {
        if (!url) return toast.error('Kaynak Bulunamadı')
        window.open(url, '_blank')
    }

    if (loading) {
        return (
            <div className="justify-center text-5xl">
                <svg
                    aria-hidden="true"
                    className="w-20 h-20 mx-auto mt-20 text-blue-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
            </div>
        )
    }

    const onSearch = (e) => {
        e.preventDefault()
        fetchSearch()
    }

    return (
        <div className="bg-second">
            <div className="flex flex-row justify-center md:space-x-10 lg:space-x-20 text-5xl text-center py-10">
                <span
                    className="hover:cursor-pointer"
                    onClick={() =>
                        setPage((page) => {
                            return page > 0 ? page - 1 : 0
                        })
                    }
                >
                    <img src={Back} width={50} height={50} />
                </span>
                <h1 className="text-3xl text-center text-fourth">
                    Arsiv Unutmaz
                </h1>
                <span
                    className="hover:cursor-pointer"
                    onClick={() => setPage(page + 1)}
                >
                    <img src={Next} width={50} height={50} />
                </span>
            </div>
            <div className="flex flex-col justify-center align-center ">
                <div className="flex mx-auto">
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                        onClick={onSearch}
                    >
                        Ara
                    </button>
                </div>

                <span className="text-center text-2xl">
                    {searchResultText !== '' && searchResultText}
                    {searchResultText === '' && `${page + 1}. Sayfa`}
                </span>
            </div>
            <div className="flex flex-col justify-center lg:px-20">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="rounded shadow-xl bg-first justify-center space-y-4 flex flex-col p-4 m-4 h-fit text-center"
                    >
                        <h2 className="text-xl">{post.title}</h2>
                        <p className="line-clamp-2">{post.selftext}</p>
                        <div className="flex flex-row justify-center gap-4 text-center py-4">
                            <Link
                                to={`/post/${post.name}`}
                                state={{ post, posts }}
                                className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                            >
                                Daha fazla...
                            </Link>
                            <a
                                target={'_blank'}
                                href={`https://www.reddit.com${post.permalink}`}
                                className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                            >
                                Gönderi Linki
                            </a>
                            <button
                                onClick={() => notify(post.source)}
                                className="bg-blue-500 hover:bg-blue-700 w-fit text-white font-bold py-2 px-4 rounded"
                            >
                                {post.source
                                    ? 'Kaynağı görüntüle'
                                    : 'Kaynak yok'}
                            </button>
                            {
                                <ToastContainer
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
                                />
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default History
