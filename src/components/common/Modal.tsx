import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden bg-cream border-2 sm:border-4 border-dark shadow-vintage-lg transition-all max-h-[90vh] flex flex-col`}
              >
                {title && (
                  <div className="flex items-center justify-between border-b-2 border-dark p-4 sm:p-6 bg-white flex-shrink-0">
                    <Dialog.Title className="text-lg sm:text-2xl font-display font-bold pr-4">
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-dark hover:text-vintage-orange transition-colors flex-shrink-0"
                      aria-label="Close modal"
                    >
                      <IoClose size={24} className="sm:w-7 sm:h-7" />
                    </button>
                  </div>
                )}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
