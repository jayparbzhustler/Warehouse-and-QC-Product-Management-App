
import React, { useState, useEffect } from 'react';
import './App.css';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  dashboardContainer: {
    width: '100%',
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  headerTitle: {
    color: '#1890ff',
    margin: 0,
  },
  button: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '0 5px',
    transition: 'background-color 0.3s',
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    fontSize: '16px',
  },
  status: {
    padding: '5px 10px',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
  },
  controlButton: {
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '10px',
    transition: 'opacity 0.3s',
  },
  approveButton: {
    backgroundColor: '#52c41a',
    color: 'white',
  },
  holdButton: {
    backgroundColor: '#faad14',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    color: 'white',
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  input: {
    border: '1px solid #d9d9d9',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '16px',
    flex: 1,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    width: '300px',
    zIndex: 1001,
  },
  modalTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  modalInput: {
    width: '100%',
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  notificationContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 2000,
  },
  notification: {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '10px',
    opacity: 0.9,
    transition: 'opacity 0.5s ease-in-out',
  },
  notificationSuccess: {
    backgroundColor: '#52c41a',
  },
  notificationError: {
    backgroundColor: '#ff4d4f',
  },
};

const initialProducts = [
  { id: 1, name: 'Product A', quantity: 10, status: 'Pending', bagNumber: null },
  { id: 2, name: 'Product B', quantity: 5, status: 'On Hold', bagNumber: 'BAG-001' },
  { id: 3, name: 'Product C', quantity: 20, status: 'Approved', bagNumber: null },
];

const Modal = ({ title, children, footer, onClose }) => {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>{title}</h2>
        {children}
        <div style={styles.modalActions}>
          {footer}
        </div>
      </div>
    </div>
  );
};

const Notification = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Notification disappears after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return visible ? (
    <div
      style={{
        ...styles.notification,
        ...(type === 'success' && styles.notificationSuccess),
        ...(type === 'error' && styles.notificationError),
      }}
    >
      {message}
    </div>
  ) : null;
};

export default function WarehouseQcApp() {
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQty, setNewProductQty] = useState(1);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isHoldModalOpen, setHoldModalOpen] = useState(false);
  const [productToHold, setProductToHold] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addProduct = () => {
    if (!newProductName) {
      showNotification('Product name cannot be empty!', 'error');
      return;
    }
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: newProductName,
      quantity: newProductQty,
      status: 'Pending',
      bagNumber: null,
    };
    setProducts([...products, newProduct]);
    setNewProductName('');
    setNewProductQty(1);
    showNotification('Product added successfully!', 'success');
  };

  const updateStatus = (productId, status) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, status: status, bagNumber: p.bagNumber } : p
      )
    );
    showNotification('Product status updated!', 'success');
  };

  const handleHoldClick = (productId) => {
    setProductToHold(productId);
    setHoldModalOpen(true);
  };

  const confirmHold = (bagNumber) => {
    if (bagNumber) {
      setProducts(
        products.map((p) =>
          p.id === productToHold
            ? { ...p, status: 'On Hold', bagNumber: bagNumber }
            : p
        )
      );
      showNotification('Product held successfully!', 'success');
    } else {
      showNotification('Bag number cannot be empty!', 'error');
    }
    setHoldModalOpen(false);
    setProductToHold(null);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== productToDelete));
    showNotification('Product deleted successfully!', 'success');
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleQcLogin = (password) => {
    if (password === 'qc123') {
      setUserRole('QC');
      setLoginModalOpen(false);
      showNotification('Logged in as QC!', 'success');
    } else {
      showNotification('Incorrect password!', 'error');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'On Hold':
        return 'status-hold';
      case 'Pending':
      default:
        return 'status-pending';
    }
  };

  const renderProducts = () => {
    return products.map((product) => (
      <div key={product.id} className="product-card">
        <div className="product-info">
          <strong>{product.name}</strong> (Qty: {product.quantity})
          <br />
          <span className={`status ${getStatusClass(product.status)}`}>
            {product.status}
          </span>
          {product.bagNumber && <span style={{marginLeft: '10px'}}> (Bag: {product.bagNumber})</span>}
        </div>
        <div className="controls">
          {userRole === 'QC' && (
            <>
              <button
                className="control-button approve-button"
                onClick={() => updateStatus(product.id, 'Approved')}
              >
                Approve
              </button>
              <button
                className="control-button hold-button"
                onClick={() => handleHoldClick(product.id)}
              >
                Hold
              </button>
              <button
                className="control-button delete-button"
                onClick={() => handleDeleteClick(product.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      {notification && (
        <div className="notification-container">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {isLoginModalOpen && (
        <Modal
          title="QC Login"
          onClose={() => setLoginModalOpen(false)}
          footer={
            <>
              <button style={{...styles.button, backgroundColor: '#ccc'}} onClick={() => setLoginModalOpen(false)}>Cancel</button>
              <button style={styles.button} onClick={() => handleQcLogin(document.getElementById('qc-password-input').value)}>Login</button>
            </>
          }
        >
          <input
            id="qc-password-input"
            type="password"
            placeholder="Enter password"
            style={{...styles.input, ...styles.modalInput}}
          />
        </Modal>
      )}

      {isHoldModalOpen && (
        <Modal
          title="Enter Bag Number"
          onClose={() => setHoldModalOpen(false)}
          footer={
            <>
              <button style={{...styles.button, backgroundColor: '#ccc'}} onClick={() => setHoldModalOpen(false)}>Cancel</button>
              <button style={styles.button} onClick={() => confirmHold(document.getElementById('bag-number-input').value)}>Save</button>
            </>
          }
        >
          <input
            id="bag-number-input"
            type="text"
            placeholder="Bag Number"
            style={{...styles.input, ...styles.modalInput}}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setDeleteModalOpen(false)}
          footer={
            <>
              <button style={{...styles.button, backgroundColor: '#ccc'}} onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button style={{...styles.button, ...styles.deleteButton}} onClick={confirmDelete}>Delete</button>
            </>
          }
        >
          <p>Are you sure you want to delete product {products.find(p => p.id === productToDelete)?.name}?</p>
        </Modal>
      )}

      {!userRole ? (
        <div className="login-container">
          <h1 style={{color: '#1890ff', marginBottom: '30px'}}>Welcome</h1>
          <button className="button" onClick={() => setLoginModalOpen(true)}>
            Login as QC
          </button>
          <div style={{height: '10px'}}></div>
          <button className="button" onClick={() => setUserRole('Warehouse')}>
            Login as Warehouse
          </button>
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="header">
            <h1 className="header-title">{userRole} Dashboard</h1>
            <button
              className="button logout-button"
              onClick={() => setUserRole(null)}
            >
              Logout
            </button>
          </div>

          {userRole === 'QC' && (
            <div className="form">
              <input
                className="input"
                type="text"
                placeholder="New Product Name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <input
                className="input"
                style={{flex: 0.5}}
                type="number"
                placeholder="Quantity"
                value={newProductQty}
                onChange={(e) => setNewProductQty(Number(e.target.value))}
                min="1"
              />
              <button className="button" onClick={addProduct}>
                Add Product
              </button>
            </div>
          )}

          <div>{renderProducts()}</div>
        </div>
      )}
    </div>
  );
}
