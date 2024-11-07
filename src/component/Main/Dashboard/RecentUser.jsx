

const recentUser = [
    {
        name: 'Md Rakib Islam',
        image: 'https://i.postimg.cc/0QZmYnLd/rakib.png'
    },
    {
        name: 'Md Rakib Islam',
        image: 'https://i.postimg.cc/0QZmYnLd/rakib.png'
    },
    {
        name: 'Md Rakib Islam',
        image: 'https://i.postimg.cc/0QZmYnLd/rakib.png'
    },
    {
        name: 'Md Rakib Islam',
        image: 'https://i.postimg.cc/0QZmYnLd/rakib.png'
    },
    {
        name: 'Md Rakib Islam',
        image: 'https://i.postimg.cc/0QZmYnLd/rakib.png'
    }
]

const RecentUser = () => {
    return (
        <div className="w-full col-span-full md:col-span-2 p-5 bg-white rounded-lg">
            <h1 className="font-semibold py-3">Recent Users</h1>
            <div className="flex flex-col gap-5 ">
                {
                    recentUser.map(user => <div key={user.name} className="flex items-center gap-2">
                        <img src={user.image} alt={user.name} className='size-12 rounded-full' />
                        <span>{user.name}</span>
                    </div>)
                }
            </div>
        </div>
    )
}

export default RecentUser
