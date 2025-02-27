function Branch({ image, alt, uri }) {
  return (
    <>
      <a
        href={uri}
        className="relative mt-6 flex justify-center items-center hover:scale-125 transition-transform duration-200 ease-in-out"
      >
        <div className="absolute w-32 h-32 rounded-full bg-radial"></div>
        <img
          src={image}
          alt={alt}
          className="relative z-10 p-6 w-32 h-32 object-contain rounded-full overflow-visible"
        />
      </a>
    </>
  );
}

export default Branch;
