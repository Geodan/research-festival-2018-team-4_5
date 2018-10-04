#docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine build \
#    -i /pointclouds/arenagebied.las \
#    -o /pointclouds/entwine

docker run -it -v ~/festival/pointclouds:/pointclouds connormanning/entwine convert \
    -i /pointclouds/entwine \
    -o /pointclouds/cesium/entwine
