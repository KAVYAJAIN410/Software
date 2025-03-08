import SessionWrapper from "./sessionWrapper"
export default function NavBar(){
    return (
        <>
        <div className="flex shadow-md" style={{justifyContent:"space-between", alignContent:"center",alignItems:"center",borderRadius:"100px",backgroundColor:"#FBF2E0"}}>
            <div className="flex text-xl" style={{justifyContent:"space-between",alignContent:"center",alignItems:"center",padding:"10px",gap:"10px"}}>
                <p>Dashboard</p>
                <SessionWrapper></SessionWrapper>
            </div>
        </div>
        </>
    )
}