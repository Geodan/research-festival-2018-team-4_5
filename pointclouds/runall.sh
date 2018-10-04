docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine build \
    -c /pointclouds/entwine.json
docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine convert \
    -i /pointclouds/entwine \
    -o /pointclouds/cesium/entwine
    
