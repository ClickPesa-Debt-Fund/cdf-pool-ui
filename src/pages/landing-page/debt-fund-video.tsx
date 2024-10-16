const DebtFundVideo = () => {
  return (
    <div className="flex justify-center">
      <iframe
        className="w-full aspect-video rounded-lg overflow-hidden"
        src="https://www.youtube.com/embed/KkLjqOpYr1Y?si=QwJfXh9N62b7QksA&amp;controls=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default DebtFundVideo;
