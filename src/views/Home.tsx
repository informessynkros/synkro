import NavbarHome from "../components/ui/navbar/NavbarHome"
import Title from "../components/ui/title/Title"

const Home = () => {
  return (
    <>
      <NavbarHome />

      <div className="min-h-screen">
        {/* <Title title="Welcome to the synkros warehouse" size="text-5xl" /> */}
        <Title
          title="Welcome to the Synkro warehouse"
          typography="h1"
          fontWeight="extrabold"
          className="text-teal-600 mb-4"
        />
      </div>
    </>
  )
}

export default Home