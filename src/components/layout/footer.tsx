
export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} BLOOM. All rights reserved.</p>
      </div>
    </footer>
  );
}
