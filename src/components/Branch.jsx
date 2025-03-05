function Branch({ image, alt, uri }) {
  return (
    <>
      <a
        href={uri}
        className="relative mt-6 flex justify-center items-center hover:scale-125 transition-transform duration-200 ease-in-out"
      >
        <div className="absolute rounded-full bg-radial w-12 h-12 md:w-32 md:h-32"></div>
        <img
          src={image}
          alt={alt}
          className="relative z-10 w-10 h-10 p-2 md:p-6 md:w-32 md:h-32 object-contain rounded-full overflow-visible"
        />
      </a>
    </>
  );
}

export default Branch;
