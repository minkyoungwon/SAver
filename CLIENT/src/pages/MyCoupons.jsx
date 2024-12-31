function MyCoupons({coupons}) {
  return (
    <div>
      <h1>MyCoupons</h1>

      {coupons.map((coupon) => (
        <div key={coupon.id} className="w-1/2 h-20 bg-gray-200 rounded-md p-2 m-2">
          <h2>{coupon.title}</h2>
          <p>{coupon.description}</p>
        </div>
      ))}

    </div>
  )
}

export default MyCoupons