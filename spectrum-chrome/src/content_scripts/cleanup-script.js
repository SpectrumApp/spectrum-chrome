document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
  detail: {
    action: 'CLEANUP'
  }
}));

document.getElementsByClassName('spectrumJs').forEach(function(node) {
  node.remove();
  //   node.parentNode.removeChild(node);
});
