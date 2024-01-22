import { render, waitFor, screen } from "@testing-library/react";
import About from "../pages/About";
import "../../setupTests";

test('changes document title to "About"', async () => {
  render(<About />);

  // Wait for the document title to change
  await waitFor(() => expect(document.title).toBe("About"));
});
