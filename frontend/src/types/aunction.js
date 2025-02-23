import PropTypes from "prop-types"

export const AunctionType = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  current_price: PropTypes.number,
  final_price: PropTypes.number,
  end_time: PropTypes.string,
  active: PropTypes.bool,
  bids_count: PropTypes.number,
  current_bid: PropTypes.number,
}).isRequired
