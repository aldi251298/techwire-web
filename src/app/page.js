// Fungsi untuk mengirim permintaan ke WordPress GraphQL API
async function fetchWordPressPosts() {
  const query = `
    query GetPosts {
      posts {first: 10, where: { orderby: { field: DATE, order: DESC } }) { // Ambil 10 terbaru
      nodes {
        id
        title
        slug
        date
        // Kita akan tambahkan field lain di sini nanti
      }
    }
  }
`;
        nodes {
          id
            title
slug
date
}
}
}
`;

  const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    // next: { revalidate: 60 } // Opsional: untuk revalidasi data setiap 60 detik
  });

  if (!response.ok) {
    // Jika ada error saat fetch, kita bisa menanganinya di sini
    console.error("Gagal mengambil data:", response.status, response.statusText);
    throw new Error('Gagal mengambil data dari WordPress');
  }

  const json = await response.json();
  return json.data.posts.nodes;
}

// Ini adalah Komponen Halaman Utama kita
export default async function HomePage() {
  let posts = [];
  let error = null;

  try {
    posts = await fetchWordPressPosts();
  } catch (e) {
    error = e.message;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 sm:p-12 md:p-24 bg-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 w-full">
          Blog Saya dari WordPress
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!error && posts.length === 0 && (
         <p className="text-gray-600">Belum ada postingan.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              {/* Baris di bawah ini untuk membuat judul bisa diklik jika kamu membuat halaman detail postingan nantinya */}
              {/* <a href={`/blog/${post.slug}`} className="hover:underline"> */}
                {post.title}
              {/* </a> */}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Dipublikasikan pada: {new Date(post.date).toLocaleDateString()}
            </p>
            {/* Jika kamu ingin menampilkan konten, kamu perlu query 'content' dan render HTML dengan hati-hati */}
            {/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
          </article>
        ))}
      </div>
    </main>
  );
}
