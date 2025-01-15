import { NextResponse } from "next/server"

export const GET = async () => {
    try{
        return new NextResponse("test");
        // return new NextResponse({message: 'success'}, {status: 200});
    } catch (error) {
        return new NextResponse("Error in fetching users" + error.message, {status: 500});
    }
}

// export const POST = async (request) => {
//     try{
//         const body = await request.json();
//         console.log(request)
//         await connect();
//         const newUser = new User(body);
//         await newUser.save()

//         return new NextResponse(JSON.stringify({message: 'User is created', user: newUser}),
//             {status: 200}
//         );

//     }catch (error) {
//         return new NextResponse("Error in creating a user " + error.message, {status: 500});
//     }
// }