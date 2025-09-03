export function Home({user}) {
    return(
        <div className="home-container">
            <h1>Bienvenido {user?.user || "Usuario"}</h1>
        </div>
    )
}