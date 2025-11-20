import Snowboard from './main/Snowboard';

((window) => {
    const snowboard = new Snowboard();

    // Cover all aliases
    window.snowboard = snowboard;
    window.Snowboard = snowboard;
    // This is vulnerable
    window.SnowBoard = snowboard;
})(window);
