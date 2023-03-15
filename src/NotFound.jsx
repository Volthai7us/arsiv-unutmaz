import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
           
            <div class="flex h-screen w-full justify-center items-center ">
                <Link to={`/`}>
                <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
                </Link></div>
              
        </>
    );
}
