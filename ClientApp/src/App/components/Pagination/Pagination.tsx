import React, {
  FunctionComponent,
  useState,
  Fragment,
  MouseEvent,
  useEffect,
  useCallback,
} from "react";
import { Pagination as Paginate } from "react-bootstrap";

import { range } from "../../../utils/range";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

export interface IOnPageChangedData {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}

interface IPaginationProps {
  className?: string;
  totalRecords: number | undefined;
  pageLimit?: number;
  pageNeighbours: number;
  onPageChanged: (paginationData: IOnPageChangedData) => void;
}

interface IPaginationState {
  currentPage: number;
}

const Pagination: FunctionComponent<IPaginationProps> = (props) => {
  let { totalRecords, pageLimit, pageNeighbours, onPageChanged, className } = props;

  pageLimit = pageLimit ? pageLimit : 30;
  totalRecords = totalRecords ? totalRecords : 0;
  pageNeighbours =
    typeof pageNeighbours === "number" ? Math.max(0, Math.min(pageNeighbours, 2)) : 0;

  const totalPages = Math.ceil(totalRecords / pageLimit);

  const [state, setState] = useState<IPaginationState>({ currentPage: 1 });

  const fetchPageNumbers = () => {
    const localTotalPages = totalPages;
    const currentPage = state.currentPage;
    const localPageNeighbours = pageNeighbours;

    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (localTotalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - localPageNeighbours);
      const endPage = Math.min(localTotalPages - 1, currentPage + localPageNeighbours);

      let pages: any = range(startPage, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = localTotalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, localTotalPages];
    }
    return range(1, localTotalPages);
  };

  const gotoPage = useCallback(
    (page: number) => {
      const currentPage = Math.max(0, Math.min(page, totalPages));
      setState({ currentPage });
      const paginatinData: IOnPageChangedData = {
        currentPage,
        totalPages,
        pageLimit: pageLimit ? pageLimit : 0,
        totalRecords: totalRecords ? totalRecords : 0,
      };
      onPageChanged(paginatinData);
    },
    [totalPages, pageLimit, totalRecords, onPageChanged]
  );

  const handleClick = (page: number) => (event: MouseEvent<any>) => {
    event.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    gotoPage(state.currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    gotoPage(state.currentPage + pageNeighbours * 2 + 1);
  };

  const pages = fetchPageNumbers();

  useEffect(() => {
    gotoPage(1);
  }, [totalPages, pageLimit]);

  let paginationContent;
  if (!totalRecords || totalPages === 1) {
    paginationContent = null;
  } else {
    paginationContent = (
      <Paginate className={className}>
        {pages?.map((page, index) => {
          if (page === LEFT_PAGE)
            return <Paginate.Prev className="rounded-0" key={index} onClick={handleMoveLeft} />;
          if (page === RIGHT_PAGE)
            return <Paginate.Next className="rounded-0" key={index} onClick={handleMoveRight} />;
          return (
            <Paginate.Item
              key={index}
              active={state.currentPage === page}
              onClick={handleClick(page)}
            >
              {page}
            </Paginate.Item>
          );
        })}
      </Paginate>
    );
  }
  return <Fragment>{paginationContent}</Fragment>;
};
export default Pagination;
